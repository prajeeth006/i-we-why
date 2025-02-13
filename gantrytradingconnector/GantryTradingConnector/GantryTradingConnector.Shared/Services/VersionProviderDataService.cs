using GantryTradingConnector.Shared.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace GantryTradingConnector.Shared.Services
{
    public class VersionProviderDataService : IVersionProviderDataService
    {
        public async Task<VersionResponse> GetVersionDetail()
        {
            VersionResponse response = new VersionResponse();
            Assembly assembly = Assembly.GetEntryAssembly();
            AssemblyInformationalVersionAttribute versionAttribute = assembly.GetCustomAttribute<AssemblyInformationalVersionAttribute>();
            response.Version = versionAttribute?.InformationalVersion;
            return response;
        }
    }
}
