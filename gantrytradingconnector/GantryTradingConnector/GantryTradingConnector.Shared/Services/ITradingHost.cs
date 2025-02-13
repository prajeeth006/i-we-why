using GantryTradingConnector.Shared.GraphQL.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GantryTradingConnector.Shared.Services
{
    public interface ITradingHost
    {
        Task<FeatureHealth> GetHostConnection();
    }
}
