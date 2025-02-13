using System;

namespace Frontend.Vanilla.Content.Loading.RequireTranslation;

/// <summary>
/// Applies check specified by <see cref="ContentLoadOptions.RequireTranslation" />.
/// As far as the flag is specified in options, result can't be cached.
/// See <see cref="RequireTranslationPreCachingProcessor" /> which must be executed before.
/// </summary>
internal sealed class RequireTranslationJustInTimeProcessor : SyncJustInTimeContentProcessor
{
    public static readonly IJustInTimeContentProcessor Singleton = new RequireTranslationJustInTimeProcessor();

    private RequireTranslationJustInTimeProcessor() { }

    public override Content<IDocument> Process(
        SuccessContent<IDocument> content,
        ContentLoadOptions options,
        IContentLoader loader,
        Action<object> trace)
    {
        if (options.RequireTranslation)
        {
            trace?.Invoke(FailedTrace);

            return content.ToInvalid(ErrorMessage);
        }

        if (options.IncludeTranslation)
        {
            trace?.Invoke(MissingTrace);

            return content.ToNotFound();
        }

        trace?.Invoke(PassedTrace);

        return content;
    }

    public static readonly string ErrorMessage =
        $"Content must be translated to particular language but it's not (Metadata.Version is zero). {ContentLoadOptions.Disclaimer}";

    public const string PassedTrace = "Translation isn't requested so is-missing-translation check is passed.";
    public const string FailedTrace = "Translation is required, but missing it so it's invalid.";
    public const string MissingTrace = "Translation is included, but missing it so it's not found.";
}
