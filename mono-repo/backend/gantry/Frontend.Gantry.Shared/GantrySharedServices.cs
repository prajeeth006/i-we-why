using Frontend.Gantry.Shared.Configuration;
using Frontend.Gantry.Shared.Content;
using Frontend.Gantry.Shared.Core;
using Frontend.Gantry.Shared.Core.Health;
using Frontend.Gantry.Shared.Core.Services.Kafka.Jobs;
using Frontend.Vanilla.Content.Templates.Mapping;
using Frontend.Vanilla.Core.Diagnostics.Health;
using Frontend.Vanilla.Features.Diagnostics.SiteVersion;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Gantry.Shared
{
    public static class GantrySharedServices
    {
        public static void AddGantrySharedServices(this IServiceCollection services)
        {

            services.AddSingleton<IDiagnosticsComponentProvider, GantryDiagnosticsComponentProvider>();

            // content
            services.AddSingleton(p => new TemplateAssemblySource(typeof(ContentMappingProfile).Assembly, new ContentMappingProfile()));
            services.AddGantryConfiguration();
            services.AddGantryCoreServices();

            //Jobs
            services.AddSingleton<ConsumeKafkaRtmsPresenceJob>();
            services.AddSingleton<ConsumeKafkaSiteCoreJob>();

            //Health
            services.AddSingleton<IHealthCheck, CdsApiHealthCheck>();
            services.AddSingleton<IHealthCheck, SitecoreRtmsHealth>();
            services.AddSingleton<ISitecoreRtmsHealth, SitecoreRtmsHealth>();

        }
    }
}
