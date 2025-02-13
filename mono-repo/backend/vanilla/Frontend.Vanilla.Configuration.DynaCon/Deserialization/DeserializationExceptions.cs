using System;
using Frontend.Vanilla.Configuration.DynaCon.Context;
using Frontend.Vanilla.Core.System.Text;

namespace Frontend.Vanilla.Configuration.DynaCon.Deserialization;

internal sealed class ChangesetDeserializationException(string message, IFailedChangeset changeset) : AggregateException(message, changeset.Errors)
{
    public IFailedChangeset FailedChangeset { get; } = changeset;

    public override string Message { get; } = message; // On .NET Core it appends inner messages
}

internal sealed class FeatureDeserializationException(TrimmedRequiredString featureName, TrimmedRequiredString? message = null, Exception? innerException = null)
    : Exception(message ?? $"Failed deserializing feature '{featureName}'.", innerException)
{
    public TrimmedRequiredString FeatureName { get; } = featureName;
}

internal sealed class InstanceDeserializationException(VariationContext context, Exception innerException)
    : Exception($"Failed deserializing instance for variation context {context}.", innerException)
{
    public VariationContext Context { get; } = context;
}
