using System;
using System.Collections.Generic;
using System.Linq;
using Bwin.DynaCon.Api.Contracts.V1;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Context;
using Frontend.Vanilla.Configuration.DynaCon.Deserialization;
using Frontend.Vanilla.Configuration.DynaCon.Deserialization.A_Changeset;
using Frontend.Vanilla.Configuration.DynaCon.Polling;
using Frontend.Vanilla.Configuration.DynaCon.Polling.ProactiveValidation;
using Frontend.Vanilla.Configuration.DynaCon.Reporting;
using Frontend.Vanilla.Configuration.DynaCon.RestService;
using Frontend.Vanilla.Configuration.DynaCon.Tests.Fakes;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Polling.ProactiveValidation;

public class ProactiveValidationJobTests
{
    private IScheduledJob target;
    private Mock<IConfigurationRestService> restService;
    private Mock<IChangesetDeserializer> deserializer;
    private Mock<IHistoryLog<ValidatedChangesetInfo>> validatedLog;
    private TestClock clock;

    private VariationContextHierarchy ctxHierarchy;
    private ConfigurationResponse dto1;
    private ConfigurationResponse dto2;
    private ConfigurationResponse dto3;
    private IValidChangeset changeset1;
    private IFailedChangeset changeset2;

    public ProactiveValidationJobTests()
    {
        restService = new Mock<IConfigurationRestService>();
        deserializer = new Mock<IChangesetDeserializer>();
        validatedLog = new Mock<IHistoryLog<ValidatedChangesetInfo>>();
        ctxHierarchy = TestCtxHierarchy.Get();
        clock = new TestClock();
        target = new ProactiveValidationJob(restService.Object, deserializer.Object, validatedLog.Object, ctxHierarchy.AsCurrent(), clock);

        dto1 = TestConfigDto.Create(111, lastCommitId: 91);
        dto2 = TestConfigDto.Create(222, lastCommitId: 92);
        dto3 = TestConfigDto.Create(333); // No CommitId -> should be skipped
        changeset1 = Mock.Of<IValidChangeset>();
        changeset2 = Mock.Of<IFailedChangeset>(c => c.Errors == new[] { new Exception() });

        restService.Setup(s => s.GetValidatableChangesetIds()).Returns(new[] { dto1.ChangesetId, dto2.ChangesetId, dto3.ChangesetId });
        restService.Setup(s => s.GetConfiguration(dto1.ChangesetId)).Returns(dto1);
        restService.Setup(s => s.GetConfiguration(dto2.ChangesetId)).Returns(dto2);
        restService.Setup(s => s.GetConfiguration(dto3.ChangesetId)).Returns(dto3);
        deserializer.Setup(d => d.Deserialize(dto1, ctxHierarchy, ConfigurationSource.Service)).Returns(changeset1);
        deserializer.Setup(d => d.Deserialize(dto2, ctxHierarchy, ConfigurationSource.Service)).Throws(new ChangesetDeserializationException("Foo", changeset2));
    }

    [Fact]
    public void GetInterval_ShouldComeFromSettings()
    {
        var settings = TestSettings.Get(s =>
        {
            s.ProactiveValidationPollingInterval = TimeSpan.FromSeconds(66);
            s.SendFeedback = true;
        });
        target.GetInterval(settings).Should().Be(TimeSpan.FromSeconds(66));
    }

    [Fact]
    public void ShouldGetChangesetsDeserializeThemSendingFeedback()
    {
        var validated = new List<ValidatedChangesetInfo>();
        validatedLog.SetupWithAnyArgs(l => l.AddRange(null)).Callback<IEnumerable<ValidatedChangesetInfo>>(validated.AddRange);

        target.Execute(); // Act

        deserializer.VerifyWithAnyArgs(d => d.Deserialize(null, null, default), Times.Exactly(2));
        validated.Should().HaveCount(3);
        VerifyValidated(0, dto1.ChangesetId, ProactiveValidationJob.Results.Valid);
        VerifyValidated(1, dto2.ChangesetId, $"{ProactiveValidationJob.Results.InvalidPrefix}{typeof(ChangesetDeserializationException)}: Foo");
        VerifyValidated(2, dto3.ChangesetId, ProactiveValidationJob.Results.Skipped);

        void VerifyValidated(int index, long changesetId, string result)
        {
            validated[index].ChangesetId.Should().Be(changesetId);
            validated[index].Result.Value.Should().StartWith(result);
            validated[index].Time.Should().Be(clock.UtcNow);
        }
    }

    [Fact]
    public void ShouldNotMakeAdditionalRequests_IfNoChangesets()
    {
        restService.Setup(s => s.GetValidatableChangesetIds()).Returns(Array.Empty<long>());

        target.Execute(); // Act

        restService.VerifyWithAnyArgs(s => s.GetConfiguration(default), Times.Never);
        deserializer.VerifyWithAnyArgs(d => d.Deserialize(null, null, default), Times.Never);
        validatedLog.Verify(l => l.AddRange(It.Is<IEnumerable<ValidatedChangesetInfo>>(i => !i.Any())));
    }

    [Fact]
    public void ShouldNotMakeAdditionalRequests_IfOnlyChangesetWithoutCommitId()
    {
        restService.Setup(s => s.GetValidatableChangesetIds()).Returns(new[] { dto3.ChangesetId });

        target.Execute(); // Act

        restService.VerifyWithAnyArgs(s => s.GetConfiguration(default), Times.Once);
        deserializer.VerifyWithAnyArgs(d => d.Deserialize(null, null, default), Times.Never);
        validatedLog.Verify(l => l.AddRange(It.Is<IEnumerable<ValidatedChangesetInfo>>(i => i.Count() == 1)));
    }
}
