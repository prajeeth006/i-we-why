using System;
using Bwin.DynaCon.Api.Contracts.V1;
using Frontend.Vanilla.Configuration.DynaCon.Context;
using Frontend.Vanilla.Configuration.DynaCon.Deserialization;
using Frontend.Vanilla.Configuration.DynaCon.Deserialization.A_Changeset;
using Frontend.Vanilla.Configuration.DynaCon.Reporting;
using Frontend.Vanilla.Configuration.DynaCon.RestService;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Time;

namespace Frontend.Vanilla.Configuration.DynaCon.Polling.ProactiveValidation;

/// <summary>
/// Fetches validatable changesets (e.g. waiting for approval) from DynaCon in order to proactively validate them.
/// </summary>
internal sealed class ProactiveValidationJob(
    IConfigurationRestService restService,
    IChangesetDeserializer deserializer,
    IHistoryLog<ValidatedChangesetInfo> validatedLog,
    ICurrentContextHierarchy currentContextHierarchy,
    IClock clock)
    : IScheduledJob
{
    public TimeSpan? GetInterval(DynaConEngineSettings settings)
        => settings.ProactiveValidationPollingInterval;

    public void Execute()
    {
        var changesetIds = restService.GetValidatableChangesetIds();
        var dtos = changesetIds.ConvertAll(id => restService.GetConfiguration(id));

        // Actual validation
        var time = clock.UtcNow; // Use same time for all changesets in this job run
        var validatedInfos = dtos.ConvertAll(dto =>
        {
            var result = ValidateByDeserializingChangeset(dto);

            return new ValidatedChangesetInfo(time, dto.ChangesetId, result);
        });
        validatedLog.AddRange(validatedInfos);
    }

    // Feedback is sent automatically by <see cref = "FeedbackDeserializerDecorator" />.
    private RequiredString ValidateByDeserializingChangeset(ConfigurationResponse dto)
    {
        if (dto.LastCommitId == null)
            return Results.Skipped;

        try
        {
            deserializer.Deserialize(dto, currentContextHierarchy.Value, ConfigurationSource.Service);

            return Results.Valid;
        }
        catch (ChangesetDeserializationException ex)
        {
            return Results.InvalidPrefix + ex;
        }
    }

    public static class Results
    {
        public const string Valid = "Valid changeset.";
        public const string InvalidPrefix = "Invalid changeset: ";
        public const string Skipped = "Validation was skipped because the changeset has no LastCommitId which means it was reopened or already approved.";
    }
}
