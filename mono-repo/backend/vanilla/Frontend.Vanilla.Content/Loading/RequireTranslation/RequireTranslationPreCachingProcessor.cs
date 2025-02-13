using System;
using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Content.Templates;
using Frontend.Vanilla.Content.Templates.DataSources;

namespace Frontend.Vanilla.Content.Loading.RequireTranslation;

/// <summary>
/// Determines whether it makes sense to check using <see cref="RequireTranslationJustInTimeProcessor" /> that particular content is translated if requested by developer.
/// </summary>
internal sealed class RequireTranslationPreCachingProcessor : SyncPreCachingContentProcessor
{
    private readonly IReadOnlyDictionary<string, SitecoreTemplate> templates;

    public RequireTranslationPreCachingProcessor(IReflectionTemplatesSource templatesSource)
        => templates = templatesSource.Templates
            .ToDictionary(t => t.Name, StringComparer.OrdinalIgnoreCase);

    public override Content<IDocument> Process(SuccessContent<IDocument> content, ICollection<IJustInTimeContentProcessor> justInTimeProcessors, Action<object> trace)
    {
        var isTranslated = content.Metadata.Version > 0;
        var isMissingTranslation = !isTranslated && CanBeTranslated(content);

        if (isMissingTranslation)
        {
            trace?.Invoke(TraceMessages.MissingTranslation);
            justInTimeProcessors.Add(RequireTranslationJustInTimeProcessor.Singleton);
        }
        else
        {
            trace?.Invoke(isTranslated ? TraceMessages.Translated : TraceMessages.NotTranslatable);
        }

        return content;
    }

    public static class TraceMessages
    {
        public const string MissingTranslation = "The content gets is-missing-translation flag because it has translatable fields but isn't translated.";
        public const string Translated = "The content doesn't get is-missing-translation flag because it is correctly translated.";
        public const string NotTranslatable = "The content doesn't get is-missing-translation flag because it has no tranlatable fields.";
    }

    private bool CanBeTranslated(SuccessContent<IDocument> content)
    {
        if (content.Document.Data.Fields.Count <= 0)
            return false; // E.g. IFolder has no fields

        var template = templates[content.Metadata.TemplateName];

        return template.AllFields.Any(x => !x.Shared);
    }
}
