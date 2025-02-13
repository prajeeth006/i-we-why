using GantryTradingConnector.Shared.Models;
using GantryTradingConnector.Shared.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GantryTradingConnector.Shared.Business
{
    public class VersionProviderBusiness : IVersionProviderBusiness
    {
        private readonly IVersionProviderDataService _versionProviderDataService;

        public VersionProviderBusiness(IVersionProviderDataService versionProviderDataService)
        {
            _versionProviderDataService = versionProviderDataService;
        }

        public async  Task<VersionResponse> GetVersionDetail()
        {
            return await _versionProviderDataService.GetVersionDetail();
        }
    }
}
