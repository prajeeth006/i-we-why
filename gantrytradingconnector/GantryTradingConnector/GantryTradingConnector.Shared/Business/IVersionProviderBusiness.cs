using GantryTradingConnector.Shared.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GantryTradingConnector.Shared.Business
{
    public interface IVersionProviderBusiness
    {
        Task<VersionResponse> GetVersionDetail();
    }
}
