using System.Runtime.CompilerServices;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Model;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.TestWeb.Controllers;

public class ContentApiTestController(IContentService contentService) : Controller
{
    [HttpGet]
    [Route("/en/playground/contentapitest")]
    public ActionResult Index()
    {
        var content = contentService.Get<IPMBasePage>(PlaygroundPlugin.PublicPagePath + "OneColPage");
        var id = RuntimeHelpers.GetHashCode(content) + "|" + ((DocumentMetadata)content.Metadata).SitecoreLoadTime;

        return Content(id);
    }
}
