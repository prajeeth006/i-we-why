using System;
using System.Collections.Generic;
using Frontend.Vanilla.Content.Client;
using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Content.Client.Mappers;
using Frontend.Vanilla.Content.ContentServiceImpl;
using Frontend.Vanilla.Content.DataSources;
using Frontend.Vanilla.Content.Diagnostics;
using Frontend.Vanilla.Content.Loading;
using Frontend.Vanilla.Content.Loading.Caching;
using Frontend.Vanilla.Content.Loading.Deserialization;
using Frontend.Vanilla.Content.Loading.FilterCondition;
using Frontend.Vanilla.Content.Loading.InlinedFilters;
using Frontend.Vanilla.Content.Loading.JustInTime;
using Frontend.Vanilla.Content.Loading.Placeholders;
using Frontend.Vanilla.Content.Loading.Proxy;
using Frontend.Vanilla.Content.Loading.ProxyFolder;
using Frontend.Vanilla.Content.Loading.RequireTranslation;
using Frontend.Vanilla.Content.Loading.XmlSources;
using Frontend.Vanilla.Content.Menus;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Content.Placeholders;
using Frontend.Vanilla.Content.Placeholders.Replacers;
using Frontend.Vanilla.Content.Templates.DataSources;
using Frontend.Vanilla.Content.Templates.Mapping;
using Frontend.Vanilla.Core;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.DependencyInjection;
using Frontend.Vanilla.Core.DependencyInjection.Decorator;
using Frontend.Vanilla.Core.Diagnostics;
using Frontend.Vanilla.Core.Diagnostics.Health;
using Frontend.Vanilla.Core.Reflection.Facade;
using Frontend.Vanilla.DomainSpecificLanguage;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace Frontend.Vanilla.Content;

/// <summary>
/// Vanilla infrastructure for loading content from Sitecore CMS.
/// </summary>
public static class VanillaContentServices
{
    /// <summary>
    /// Adds services related to Vanilla infrastructure for loading content from Sitecore CMS.
    /// Also adds dependencies: <see cref="VanillaCoreServices.AddVanillaCore" />, <see cref="VanillaDslServices.AddVanillaDomainSpecificLanguage" />.
    /// </summary>
    public static IServiceCollection AddVanillaSitecoreContent(this IServiceCollection services)
    {
        if (!services.TryMarkAsLoaded("Vanilla.Content.Sitecore"))
            return services;

        // Dependencies
        services.AddVanillaDomainSpecificLanguage();

        // Actual content loading process
        services.AddSingleton<IDeserializationContentLoader, DeserializationContentLoader>();
        services.AddSingleton<IDocumentDeserializer, DocumentDeserializer>();
        services.AddSingleton<IPreCachingContentLoader, PreCachingContentLoader>(new InjectedArgument(p => new List<IPreCachingContentProcessor>
        {
            p.Create<RequireTranslationPreCachingProcessor>(), // Cheap; If not translated -> stop
            p.Create<FilterConditionPreCachingProcessor>(), // Cheap; If filter-not passed -> stop
            p.Create<InlinedFiltersPreCachingProcessor>(), // Heavy; Filters out some content parts, possibly placeholders
            p.Create<PlaceholdersPreCachingProcessor>(), // Heavy
            p.GetServices<IPreCachingContentProcessor>(), // Custom processors from product apps
            p.Create<ProxyPreCachingContentProcessor>(), // Last b/c removes all others so that it executes standalone
            p.Create<ProxyFolderPreCachingContentProcessor>(), // Last b/c removes all others so that it executes standalone
        }));
        services.AddSingleton<ICachedContentLoader, CachedContentLoader>();
        services.AddSingletonWithDecorators<IContentLoader, JustInTimeContentLoader>(b => b
            .DecorateBy<ExceptionHandlingDecorator>());

        services.AddSingleton<IPrefetchedContentLoader, JustInTimePrefetchedContentLoader>();

        services.AddSingleton<IContentXmlParser, ContentXmlParser>();
        services.AddSingleton<IContentXmlSource>(p =>
        {
            IContentXmlSource xmlSource = p.Create<SitecoreServiceContentXmlSource>();

            return p.Create<DistributedCacheContentXmlDecorator>(xmlSource);
        });

        // Diagnostics
        services.AddSingleton<IHealthCheck, SitecoreContentHealthCheck>();
        services.AddSingleton<IHealthCheck, ContentTemplatesHealthCheck>();
        services.AddSingleton<IContentTemplatesComparer, ContentTemplatesComparer>();
        services.AddSingleton<IDiagnosticInfoProvider, ContentTemplatesDiagnosticProvider>();

        // Templates
        services.AddSingleton<IReflectionTemplatesSource, ReflectionTemplatesSource>();
        services.AddSingleton<IReflectionTemplatesResolver, ReflectionTemplatesResolver>();
        services.AddSingleton<ISitecoreServiceTemplatesSource, SitecoreServiceTemplatesSource>();
        services.AddSingletonWithDecorators<ISitecoreServiceTemplatesXmlParser, SitecoreServiceTemplatesXmlParser>(b => b
            .DecorateBy<FolderHackTemplatesXmlParser>());

        // IContentService
        services.AddFacadeFor<IContentService>();
        services.AddSingleton<IGetChildrenCommand, GetChildrenCommand>();
        services.AddSingleton<IGetDocumentCommand, GetDocumentCommand>();
        services.AddSingleton<IGetDocumentsCommand, GetDocumentsCommand>();
        services.AddSingleton<IGetContentCommand, GetContentCommand>();
        services.AddSingleton<IGetRequiredStringCommand, GetRequiredStringCommand>();
        services.AddSingleton<IGetPrefetchedDocumentCommand, GetPrefetchedDocumentCommand>();
        services.AddSingleton<IGetPrefetchedContentCommand, GetPrefetchedContentCommand>();

        // IClientContentService
        services.AddSingleton<IClientContentRegionalResolver, ClientContentRegionalResolver>();
        services.TryAddSingleton<IContentRegionResolver, StaticContentRegionResolver>();
        services.AddSingleton<IClientContentServiceFactory>(p =>
        {
            object mappers = new[]
            {
                ClientContentMapping.Create(p.Create<ClientDocumentMapper>(), isFinalType: false),
                ClientContentMapping.Create(p.Create<ClientFilteredDocumentMapper>(), isFinalType: false),
                ClientContentMapping.Create(p.Create<ClientPmBasePageMapper>(), isFinalType: false),
                ClientContentMapping.Create(p.Create<ClientPcBaseComponentMapper>(), isFinalType: false),

                ClientContentMapping.Create(p.Create<ClientProxyMapper>(), isFinalType: true),
                ClientContentMapping.Create(p.Create<ClientProxyFolderMapper>(), isFinalType: true),
                ClientContentMapping.Create(p.Create<ClientLinkTemplateMapper>(), isFinalType: true),
                ClientContentMapping.Create(p.Create<ClientPcComponentFolderMapper>(), isFinalType: true),
                ClientContentMapping.Create(p.Create<ClientPcContainerMapper>(), isFinalType: true),
                ClientContentMapping.Create(p.Create<ClientPcImageMapper>(), isFinalType: true),
                ClientContentMapping.Create(p.Create<ClientPcImageTextMapper>(), isFinalType: true),
                ClientContentMapping.Create(p.Create<ClientPcTeaserMapper>(), isFinalType: true),
                ClientContentMapping.Create(p.Create<ClientPcTextMapper>(), isFinalType: true),
                ClientContentMapping.Create(p.Create<ClientPm1ColMapper>(), isFinalType: true),
                ClientContentMapping.Create(p.Create<ClientPm2ColMapper>(), isFinalType: true),
                ClientContentMapping.Create(p.Create<ClientPmNav1ColMapper>(), isFinalType: true),
                ClientContentMapping.Create(p.Create<ClientFormElementTemplateMapper>(), isFinalType: true),
                ClientContentMapping.Create(p.Create<ClientViewTemplateMapper>(), isFinalType: true),
                ClientContentMapping.Create(p.Create<ClientStaticFileMapper>(), isFinalType: true),
                ClientContentMapping.Create(p.Create<ClientGenericListItemMapper>(), isFinalType: true),
                ClientContentMapping.Create(p.Create<ClientFolderMapper>(), isFinalType: true),
                ClientContentMapping.Create(p.Create<ClientPcMenuMapper>(), isFinalType: true),
                ClientContentMapping.Create(p.Create<ClientPcRegionalComponentMapper>(), isFinalType: true),
                ClientContentMapping.Create(p.Create<ClientPcCarouselMapper>(), isFinalType: true),
                ClientContentMapping.Create(p.Create<ClientPcVideoMapper>(), isFinalType: true),
                ClientContentMapping.Create(p.Create<ClientPcScrollMenuMapper>(), isFinalType: true),
            };

            return p.Create<ClientContentServiceFactory>(mappers);
        });
        services.AddSingleton(p => p.GetRequiredService<IClientContentServiceFactory>().CreateService<IVanillaClientContentService>());

        services.AddConfigurationWithBuilder<IContentConfiguration, ContentConfigurationBuilder>(ContentConfiguration.FeatureName);
        services.AddSingleton<IContentRequestFactory, ContentRequestFactory>();
        services.AddSingleton<IDocumentIdFactory, SitecoreDocumentIdFactory>();
        services.AddSingleton<IMenuFactory, MenuFactory>();
        services.TryAddSingleton<IEditorOverridesResolver, DefaultEditorOverridesResolver>();
        services.AddSingleton(_ => new TemplateAssemblySource(typeof(Document).Assembly, new DefaultTemplateMappingProfile()));
        services.TryAddSingleton<ISitecoreLanguageResolver, DefaultSitecoreLanguageResolver>();
        services.TryAddSingleton<ISmartUrlReplacementResolver, DefaultSmartUrlReplacementResolver>();

        // Placeholder replacement
        services.AddSingleton<IPlaceholderReplacer, PlaceholderReplacer>();
        services.AddSingleton<IFieldPlaceholderReplacer, ContentImagePlaceholderReplacer>();
        services.AddSingleton<IFieldPlaceholderReplacer, ContentLinkPlaceholderReplacer>();
        services.AddSingleton<IFieldPlaceholderReplacer>(p => p.GetRequiredService<ContentParametersPlaceholderReplacer>());
        services.AddSingleton<IFieldPlaceholderReplacer<ContentParameters>>(p => p.GetRequiredService<ContentParametersPlaceholderReplacer>());
        services.AddSingleton<ContentParametersPlaceholderReplacer>();
        services.AddSingleton<IFieldPlaceholderReplacer, SelectListItemPlaceholderReplacer>();
        services.AddSingleton<IFieldPlaceholderReplacer, StringPlaceholderReplacer>();
        services.AddSingleton<IFieldPlaceholderReplacer>(p => p.GetRequiredService<UriPlaceholderReplacer>());
        services.AddSingleton<IFieldPlaceholderReplacer<Uri>>(p => p.GetRequiredService<UriPlaceholderReplacer>());
        services.AddSingleton<UriPlaceholderReplacer>();

        return services;
    }
}
