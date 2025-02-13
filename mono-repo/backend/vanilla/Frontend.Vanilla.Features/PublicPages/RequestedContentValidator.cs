using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Features.PublicPages;

internal interface IRequestedContentValidator
{
    RequestedContentValidationResult Validate(Content<IDocument> content);
}

internal abstract class RequestedContentValidationResult { }

internal sealed class ErrorRequestedContentValidationResult(IReadOnlyList<TrimmedRequiredString> errors) : RequestedContentValidationResult
{
    public IReadOnlyList<TrimmedRequiredString> Errors { get; } = errors.ToList();
}

internal sealed class NotFoundRequestedContentValidationResult : RequestedContentValidationResult { }

internal sealed class OkRequestedContentValidationResult(IDocument document) : RequestedContentValidationResult
{
    public IDocument Document { get; } = document;
}

internal sealed class RequestedContentValidator(IPublicPagesConfiguration publicPagesConfiguration) : IRequestedContentValidator
{
    public RequestedContentValidationResult Validate(Content<IDocument> content)
    {
        switch (content)
        {
            case InvalidContent<IDocument> invalidContent:
                return new ErrorRequestedContentValidationResult(invalidContent.Errors);
            case NotFoundContent<IDocument> _:
            case FilteredContent<IDocument> _:
            case SuccessContent<IDocument> successContent
                when publicPagesConfiguration.UseStrict404Checking && successContent.Document is IPMBasePage && successContent.Metadata.Version == 0:
                return new NotFoundRequestedContentValidationResult();
            case SuccessContent<IDocument> successContent:
                return new OkRequestedContentValidationResult(successContent.Document);
            default:
                throw new VanillaBugException();
        }
    }
}
