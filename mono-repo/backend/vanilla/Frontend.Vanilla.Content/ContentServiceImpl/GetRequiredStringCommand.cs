using System;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Diagnostics;
using Frontend.Vanilla.Core.Expressions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Content.ContentServiceImpl;

/// <summary>
/// Gets the value of a content string field. It can't be null nor white-space. In case of an error it either throws an exception.
/// </summary>
internal interface IGetRequiredStringCommand
{
    Task<RequiredString> GetAsync<TDocument>(ExecutionMode mode, DocumentId id, Expression<Func<TDocument, string>> stringSelector)
        where TDocument : class, IDocument;
}

internal sealed class GetRequiredStringCommand(IGetContentCommand getItemCommand) : IGetRequiredStringCommand
{
    public async Task<RequiredString> GetAsync<TDocument>(ExecutionMode mode, DocumentId id, Expression<Func<TDocument, string>> stringSelector)
        where TDocument : class, IDocument
    {
        Guard.NotNull(stringSelector, nameof(stringSelector));

        var content = await getItemCommand.GetAsync<TDocument>(mode, id, options: default);

        switch (content)
        {
            case SuccessContent<TDocument> successContent:
                var func = stringSelector.CompileCached();
                var str = func(successContent.Document);

                return RequiredString.TryCreate(str) ?? throw GetError("the string is null or white-space.");

            case InvalidContent<TDocument> invalidContent:
                throw GetError($"the content has errors: {invalidContent.Errors.ToDebugString()}");

            case FilteredContent<TDocument> _:
            case NotFoundContent<TDocument> _:
                throw GetError($"status of the content is {content.Status}.");

            default:
                throw new InvalidOperationException();
        }

        Exception GetError(string reason)
            => new Exception($"Unable to get required string using expression {stringSelector} from content {content.Id} because {reason}"
                             + $" {ContentLoadOptions.Disclaimer} Called from: {CallerInfo.Get()}");
    }
}
