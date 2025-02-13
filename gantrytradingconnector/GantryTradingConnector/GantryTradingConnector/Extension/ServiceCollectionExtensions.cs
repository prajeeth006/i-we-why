using GantryTradingConnector.Shared.Common;
using GantryTradingConnector.Shared.Config;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Diagnostics.CodeAnalysis;

namespace GantryTradingConnector.Extension
{
    [ExcludeFromCodeCoverage]
    internal static class ServiceCollectionExtensions
    {

        public static IServiceCollection AddHttpClients(
            this IServiceCollection services,
            TradingApiConfiguration tradingApiConfig,
            TradingContentApiConfiguration tcaConfig)
        {
            services.AddHttpClient(Constants.TradingApi, c =>
                c.BaseAddress = new Uri(tradingApiConfig.Endpoint));

            services.AddHttpClient(Constants.TradingContentApi, c =>
                c.BaseAddress = new Uri(tcaConfig.Endpoint));

            //services.AddHttpClient(Constants.SportsAdminApi, c =>
            //    c.BaseAddress = new Uri(sportsAdminConfig.Endpoint));

            return services;
        }
    }
}
