using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Core.Collections;
using Newtonsoft.Json;

namespace Frontend.Vanilla.Features.Logging;

internal sealed class SemanticLoggingHealthFileSink : SemanticLoggingFileSink { }

internal sealed class SemanticLoggingConfiguration(params SemanticLoggingFileSink[] sinks) : ISemanticLoggingConfiguration
{
    public IReadOnlyCollection<SemanticLoggingFileSink> FileSinks => sinks;

    public string SerializeToString() => sinks.Select(JsonConvert.SerializeObject).Join();
}
