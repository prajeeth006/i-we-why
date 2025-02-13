using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Frontend.Host.Features.StaticFiles
{
    internal interface IStaticFilesConfiguration
    {
        IEnumerable<string> WhiteListedHosts { get; }
        IDictionary<string, IDictionary<string, string>> Headers { get; }
    }

    internal sealed class StaticFilesConfiguration : IStaticFilesConfiguration
    {
        public const string FeatureName = "Host.Features.StaticFiles";
        public IEnumerable<string> WhiteListedHosts { get; set; } = Array.Empty<string>();
        public IDictionary<string, IDictionary<string, string>> Headers { get; set; }

        public StaticFilesConfiguration(IDictionary<string, IDictionary<string, string>> headers)
        {
            Headers = headers;
        }
    }
}
