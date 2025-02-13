using Frontend.Vanilla.Core.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Gantry.Shared.Configuration
{
    public static class ConfigurationServices
    {
        public static void AddGantryConfiguration(this IServiceCollection services)
        {
            services.AddSingleton(new DynaConParameter("service",
                $"{GantryDynaconConfiguration.DynaconServiceName}:{GantryDynaconConfiguration.DynaconServiceVersion}"));
            services.AddSingleton(new DynaConParameter("context.product", "Gantry"));

            //Dynacon Services
            services.AddConfiguration<ISiteCoreKafkaConsumerConfig, SiteCoreKafkaConsumerConfig>("Gantry.SitecoreKafka.ConsumerConfig");
            services.AddConfiguration<IRtmsKafkaProducerConfig, RtmsKafkaProducerConfig>("Gantry.Rtmskafka.ProducerConfig");
            services.AddConfiguration<IRtmsKafkaConsumerConfig, RtmsKafkaConsumerConfig>("Gantry.RtmsKafka.ConsumerConfig");
            services.AddConfiguration<IGantryUrlsConfig, GantryUrlsConfig>("Gantry.UrlConfig");
            services.AddConfiguration<IGantryBrandUrlMapping, GantryBrandUrlMapping>("Gantry.BrandUrlMapping");
            services.AddConfiguration<IEventFeedConfig, EventFeedConfig>("Gantry.EventFeed");
            services.AddConfiguration<IAuthenticationDataFeedConfig, AuthenticationDataFeedConfig>("Gantry.DataFeedAuthentication");
            services.AddConfiguration<IGantryPlaceHoldersConfig, GantryPlaceHoldersConfig>("Gantry.PlaceHoldersInUrls");
            services.AddConfiguration<IGantryErrorPageConfiguration, GantryErrorPageConfiguration>("Gantry.ErrorPageConfig");
            services.AddConfiguration<IGantryVirtualRaceSilkImages, GantryVirtualRaceSilkImages>("Gantry.VirtualRaceSilkImages");
            services.AddConfiguration<IDisplayManagerScreens, DisplayManagerScreens>("Gantry.DisplayManagerScreens");
            services.AddConfiguration<IGantryAvrControllerBasedTimings, GantryAvrControllerBasedTimings>("Gantry.AvrPage");
            services.AddConfiguration<IGantryMarkets, GantryMarkets>("Gantry.Markets");
            services.AddConfiguration<IGantryCricketPageCountries, GantryCricketPageCountries>("Gantry.CricketPage.Countries");
            services.AddConfiguration<IGantryCache, GantryCache>("Gantry.Cache");
            services.AddConfiguration<IGantrySitecoreUrlConfig, GantrySitecoreUrlConfig>("Gantry.SitecoreUrlConfig");
            services.AddConfiguration<IGantryEvrConfiguration, GantryEvrConfiguration>("Gantry.EvrConfiguration");
            services.AddConfiguration<IGantryAvrConfiguration, GantryAvrConfiguration>("Gantry.AVRConfiguration");
            services.AddConfiguration<IGantryAuthenticationConfiguration, GantryAuthenticationConfiguration>("Gantry.Authentication");
            services.AddConfiguration<ICDSConfig, CDSConfig>("Gantry.CDSConfig");
            services.AddConfiguration<ICDSPushConnectionConfig, CDSPushConnectionConfig>("Gantry.CDSPushConnectionConfig");
            services.AddConfiguration<IGantryRacingConfiguration, GantryRacingConfiguration>("Gantry.RacingConfiguration");
        }
    }
}