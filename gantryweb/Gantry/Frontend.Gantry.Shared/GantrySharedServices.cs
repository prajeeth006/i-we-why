using Bwin.Vanilla.Content.Templates.Mapping;
using Bwin.Vanilla.Features.Assets;
using Bwin.Vanilla.Features.Diagnostics.SiteVersion;
using Frontend.Gantry.Shared.Configuration;
using Frontend.Gantry.Shared.Content;
using Frontend.Gantry.Shared.Core;
using Frontend.Gantry.Shared.Core.Services.Kafka.Jobs;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Gantry.Shared
{
    public static class GantrySharedServices
    {
        public static void AddGantrySharedServices(this IServiceCollection services)
        {
            services.AddSingleton<IDiagnosticsVersionProvider, GantryVersionProvider>();
            services.AddSingleton<IBootstrapAssetsProvider, BootstrapAssetsProvider>();
            
            // content
            services.AddSingleton(p => new TemplateAssemblySource(typeof(ContentMappingProfile).Assembly, new ContentMappingProfile()));
            services.AddGantryConfiguration();
            services.AddGantryCoreServices();

            //// Register Jobs
            //services.AddSingleton<IJobScheduler, JobScheduler>();


            services.AddSingleton<ConsumeKafkaRtmsPresenceJob>();
            services.AddSingleton<ConsumeKafkaSiteCoreJob>();
            //services.AddHostedService(provider => provider.GetService<ConsumeKafkaRtmsPresenceJob>());
        }
    }
}