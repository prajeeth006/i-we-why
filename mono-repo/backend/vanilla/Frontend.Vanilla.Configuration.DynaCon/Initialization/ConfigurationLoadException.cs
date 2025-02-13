using System;
using Frontend.Vanilla.Configuration.DynaCon.Deserialization;
using Frontend.Vanilla.Core.System.Text;

namespace Frontend.Vanilla.Configuration.DynaCon.Initialization;

/// <summary>
/// Thrown by <see cref="CurrentChangesetLoader" /> if initialization of current configuration failed.
/// </summary>
internal class ConfigurationLoadException(TrimmedRequiredString message, Exception innerException) : Exception(message, innerException)
{
    public IFailedChangeset? FailedChangeset { get; } = (innerException as ChangesetDeserializationException)?.FailedChangeset;
}
