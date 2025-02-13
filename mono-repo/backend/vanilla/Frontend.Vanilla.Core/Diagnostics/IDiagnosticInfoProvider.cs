using System;
using System.Threading;
using System.Threading.Tasks;
using System.Xml.Linq;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Core.Diagnostics;

/// <summary>
/// Easy way how to implement dedicated diagnostic page which is just showing some info, be it dynamic or static.
/// </summary>
internal interface IDiagnosticInfoProvider
{
    DiagnosticInfoMetadata Metadata { get; }
    Task<object> GetDiagnosticInfoAsync(CancellationToken cancellationToken);
}

internal sealed class DiagnosticInfoMetadata
{
    public TrimmedRequiredString Name { get; }
    public TrimmedRequiredString UrlPathSegment { get; }
    public TrimmedRequiredString ShortDescription { get; }
    public TrimmedRequiredString? DescriptionHtml { get; }

    public DiagnosticInfoMetadata(string name, string urlPath, string shortDescription, string? descriptionHtml = null)
    {
        Name = name;
        UrlPathSegment = Guard.SimpleUrlPathSegment(urlPath, nameof(urlPath));
        ShortDescription = shortDescription;
        DescriptionHtml = descriptionHtml?.AsTrimmedRequired();

        try
        {
            XElement.Parse($"<root>{descriptionHtml}</root>");
        }
        catch (Exception ex)
        {
            throw new ArgumentException($"DescriptionHtml must be well-formed HTML but it's: {descriptionHtml}", nameof(descriptionHtml), ex);
        }
    }
}

internal abstract class SyncDiagnosticInfoProvider : IDiagnosticInfoProvider
{
    Task<object> IDiagnosticInfoProvider.GetDiagnosticInfoAsync(CancellationToken cancellationToken)
        => Task.FromResult(GetDiagnosticInfo());

    public abstract DiagnosticInfoMetadata Metadata { get; }
    public abstract object GetDiagnosticInfo();
}
