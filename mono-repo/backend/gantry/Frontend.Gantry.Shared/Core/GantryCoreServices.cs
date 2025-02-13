using Frontend.Gantry.Shared.Core.BackgroundJob;
using Frontend.Gantry.Shared.Core.BusinessLogic;
using Frontend.Gantry.Shared.Core.BusinessLogic.Cache.Services;
using Frontend.Gantry.Shared.Core.BusinessLogic.ContentServices;
using Frontend.Gantry.Shared.Core.BusinessLogic.CreateUrl;
using Frontend.Gantry.Shared.Core.Common.RegularExpressions;
using Frontend.Gantry.Shared.Core.Services.Kafka;
using Frontend.Gantry.Shared.Core.Services.Kafka.Logging;
using Frontend.Gantry.Shared.Core.Services.SiteCore;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Gantry.Shared.Core
{
    public static class GantryCoreServices
    {
        public static void AddGantryCoreServices(this IServiceCollection services)
        {
            //VersionProvider
            services.AddSingleton<GantryDiagnosticsComponentProvider>();

            //Register Services
            services.AddSingleton<IRtmsKafkaProducerService, RtmsKafkaProducerService>();
            services.AddSingleton<IGantryTemplateContentService, GantryTemplateContentService>();
            services.AddSingleton<IRtmsKafkaMessageLogging, RtmsKafkaMessageLogging>();
            services.AddSingleton<IGetKeyRTMSKafka, GetKeyRTMSKafka>();

            // Register SiteCore Services
            services.AddSingleton<ISiteCoreLabelUrlService, SiteCoreLabelUrlService>();
            services.AddSingleton<ISiteCoreStaticPromotionService, SiteCoreStaticPromotionService>();
            services.AddSingleton<ISiteCoreDisplayRuleService, SiteCoreDisplayRuleService>();         
            services.AddSingleton<ISiteCoreProfileGantryRuleService, SiteCoreProfileGantryRuleService>();
            services.AddSingleton<IMultiViewRuleService, MultiViewRuleService>();
            services.AddSingleton<IMultiEventListRuleService, MultiEventListRuleService>();

            // Register Business Logic
            services.AddSingleton<IKafkaSiteCoreMessageProcessor, KafkaSiteCoreMessageProcessor>();
            services.AddSingleton<IKafkaPresenceMessageProcessor, KafkaPresenceMessageProcessor>();
            services.AddSingleton<IGantryUrlService, GantryUrlService>();
            services.AddSingleton<IHorseRacingContentService, HorseRacingContentService>();
            services.AddSingleton<IGreyHoundRacingContentService, GreyHoundRacingContentService>();
            services.AddSingleton<ICreateUrlBasedOnRuleItem, CreateUrlBasedOnRuleItem>();
            services.AddSingleton<ITargetItem, TargetItem>();
            services.AddSingleton<IReplacePlaceHoldersInUrl, ReplacePlaceHoldersInUrl>();
            services.AddSingleton<IRegexForGettingPlaceHolders, RegexForGettingPlaceHolders>();
            services.AddSingleton<IBrandImageService, BrandImageService>();
            services.AddSingleton<IBrandUrl, BrandUrl>();
            services.AddSingleton<IMultiViewService, MultiViewService>();
            services.AddSingleton<ICarouselService, CarouselService>();
            services.AddSingleton<IGantryCommonContentService, GantryCommonContentService>();
            services.AddSingleton<IGantryVirtualRaceSilksRunnerImageContentService, GantryVirtualRaceSilksRunnerImageContentService>();
            services.AddSingleton<IGantryMarketContentService, GantryMarketContentService>();
            services.AddSingleton<IGantryEvrContentService, GantryEvrContentService>();
            services.AddSingleton<IGantryAvrConfigService, GantryAvrConfigService>();
            services.AddSingleton<IScreenType, ScreenType>();
            services.AddSingleton<ILatestSixResultsContentService, LatestSixResultsContentService>();
            services.AddSingleton<ISportContentByItemPathService, SportContentByItemPathService>();

            // Register Content Service
            services.AddSingleton<ICricketContentService, CricketContentService>();
            services.AddSingleton<ISiteCoreContentService, SiteCoreContentService>();
            services.AddSingleton<IAvrContentService, AvrContentService>();

            //services.AddSingleton<GantryApiExceptionFilterAttribute>().PropertiesAutowired();
            //services.AddSingleton<GantryApiAuthenticationFilterAttribute>().PropertiesAutowired();
            //services.AddSingleton<GantryBootstrapAuthenticationFilterAttribute>().PropertiesAutowired();

            //Distributed cache
            services.AddSingleton<IDistributedCacheService, DistributedCacheService>();
            services.AddSingleton<IInitializeDistributedCacheService, InitializeDistributedCacheService>();
            services.AddSingleton<IDisplayRulesService, DisplayRulesService>();

            // Register Jobs
            services.AddSingleton<IJobScheduler, JobScheduler>();
        }
    }
}
