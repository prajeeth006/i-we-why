using System.Collections.Generic;
using Frontend.Vanilla.Content.Model;

namespace Frontend.Vanilla.Content.Client.Infrastructure;
#pragma warning disable 1591
/// <summary>
/// A base class for page matrix pages (they derive from <see cref="IPMBasePage"/>).
/// </summary>
public class ClientPMBasePage : ClientDocument
{
    public string TemplateName { get; set; }
    public string PageClass { get; set; }
    public string PageId { get; set; }
    public string PageTitle { get; set; }
    public string PageDescription { get; set; }
    public IReadOnlyDictionary<string, string> PageMetaTags { get; set; }
    public IReadOnlyDictionary<string, string> Parameters { get; set; }
}
