using System;
using System.Net.Http;
using Frontend.Vanilla.Core.Abstractions;
using Frontend.Vanilla.Core.Caching;
using Frontend.Vanilla.Core.Caching.Diagnostics;
using Frontend.Vanilla.Core.Caching.Isolation;
using Frontend.Vanilla.Core.Caching.Tracing;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.Data;
using Frontend.Vanilla.Core.DependencyInjection;
using Frontend.Vanilla.Core.DependencyInjection.Decorator;
using Frontend.Vanilla.Core.Diagnostics;
using Frontend.Vanilla.Core.Diagnostics.Health;
using Frontend.Vanilla.Core.IO;
using Frontend.Vanilla.Core.IO.Compression;
using Frontend.Vanilla.Core.IO.FileSystem;
using Frontend.Vanilla.Core.Ioc;
using Frontend.Vanilla.Core.Json.Converters;
using Frontend.Vanilla.Core.Net;
using Frontend.Vanilla.Core.Reflection;
using Frontend.Vanilla.Core.Reflection.Facade;
using Frontend.Vanilla.Core.Reflection.Proxy;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.Time;
using Frontend.Vanilla.Core.Time.Background;
using Frontend.Vanilla.Core.Utils;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;

namespace Frontend.Vanilla.Core;

/// <summary>
/// Vanilla core services.
/// </summary>
public static class VanillaCoreServices
{
    /// <summary>
    /// Adds Vanilla core services.
    /// </summary>
    public static IServiceCollection AddVanillaCore(this IServiceCollection services)
    {
        if (!services.TryMarkAsLoaded("Vanilla.Core"))
            return services;

        services.TryAddSingleton(typeof(ILogger<>), typeof(NullLogger<>));
        services.TryAddSingleton<ILoggerFactory, NullLoggerFactory>();

        // Abstractions
        services.AddSingleton<IEnvironment, EnvironmentWrapper>();
        services.AddSingleton<ITask, TaskWrapper>();
        services.AddSingleton<IThread, ThreadWrapper>();
        services.AddSingleton<IExecutionContext, ExecutionContextWrapper>();

        // Configuration
        services.TryAddSingleton<IConfigurationEngine, DependencyInjectionConfigurationEngine>();
        services.AddSingleton<IDisableableGuard, DisableableGuard>();
        services.AddSingleton(new ConfigurationInstanceJsonConverter(new StringValuesJsonConverter()));

        // Data
        services.AddSingleton<ISqlConnectionFactory, SqlConnectionFactory>();

        // FileSystem
        services.AddFacadeFor<IFileSystem>();
        services.TryAddSingleton<IAppDirectoryProvider>(new AppDirectoryProvider(Environment.CurrentDirectory));
        services.AddSingleton<IDeleteFileCommand, DeleteFileCommand>();
        services.AddSingleton<IGetPropertiesCommand, GetPropertiesCommand>();
        services.AddSingleton<IGetFilePropertiesCommand, GetFilePropertiesCommand>();
        services.AddSingleton<IReadFileBytesCommand, ReadFileBytesCommand>();
        services.AddSingleton<IReadFileTextCommand, ReadFileTextCommand>();
        services.AddSingleton<IWriteFileTextCommand, WriteFileTextCommand>();
        services.AddSingleton<IWatchFileCommand, WatchFileCommand>();

        // Rest
        services.AddHttpClient(RestClientBase.HttpClientNameWithAllowAutoRedirect)
            .ConfigurePrimaryHttpMessageHandler(() =>
                new HttpClientHandler
                {
                    AllowAutoRedirect = true,
                });
        services.AddHttpClient(RestClientBase.HttpClientNameWithoutAllowAutoRedirect)
            .ConfigurePrimaryHttpMessageHandler(() =>
                new HttpClientHandler
                {
                    AllowAutoRedirect = false,
                });

        // Generic utilities
        services.AddSingleton<IStaticContextManager, StaticContextManager>();
        services.TryAddSingleton<ICurrentContextAccessor, StaticContextAccessor>();
        services.AddSingleton<ITimerFactory, TimerFactory>();
        services.AddSingleton<ICancellationHelper, CancellationHelper>();
        services.AddSingletonWithDecorators<IRestClient, RestClient>(
            b => b.DecorateBy<TracedRestClient>());
        services.AddSingleton<IGzipCompressor, GzipCompressor>();
        services.AddSingleton<IDeflateCompressor, DeflateCompressor>();
        services.AddSingleton<IBrotliCompressor, BrotliCompressor>();
        services.AddSingleton(typeof(IHashAlgorithm<>), typeof(HashAlgorithm<>));
        services.TryAddSingleton<IClientIPResolver, LoopbackIpResolver>();
        services.TryAddSingleton<IInternalRequestEvaluator, NegativeInternalRequestEvaluator>();
        services.AddSingleton<IBackgroundWorker, BackgroundWorker>();
        services.AddSingleton<IBackgroundWorkInitializer, UserBackgroundWorkInitializer>();
        services.AddSingleton<IBackgroundWorkInitializer, CultureBackgroundWorkInitializer>();
        services.TryAddSingleton<ITraceRecorder, DisabledTraceRecorder>();
        services.AddSingleton<IClock, Clock>();
        services.TryAddSingleton<IUserTimeTransformer, SystemTimeZoneTransformer>();
        services.AddSingleton<IDiagnosticInfoProvider, RoslynProxyDiagnosticsProvider>();
        services.AddSingleton(VanillaVersion.CreateInstance());
        services.AddScoped<IRequestScopedValuesProvider, RequestScopedValuesProvider>();

        // Caching
        services.AddOptions();
        services.AddWithDecorators<IMemoryCache>(
            ServiceLifetime.Singleton,
            getImplementation: p => p.GetRequiredService<MemoryCache>(),
            configureDecoration: b => b.DecorateBy<TracedMemoryCache>());
        services.AddSingleton<MemoryCache>(); // Sometimes we need its methods e.g. Compact()
        services.AddLabelIsolatedMemoryCache();
        services.AddLabelIsolatedDistributedCache();
        services.AddSingleton<IHealthCheck, DistributedCacheHealthCheck>();
        services.ConfigureOptions<ConfigureRedisCacheOptions>();
        services.AddStackExchangeRedisCache(_ => { });

        return services;
    }
}
