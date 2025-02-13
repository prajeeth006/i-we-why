using Frontend.Vanilla.Features.WebUtilities;
using Frontend.Vanilla.RestMocks.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Frontend.TestWeb.Controllers;

[AllowAnonymous]
public class HealthRestLogController : Controller
{
    [HttpGet]
    [Route("health/_api/rest-log")]
    [DisableAuthentication]
    public JsonResult Index()
    {
        var entries = RestLog.Entries.OrderByDescending(e => e.Info.Time);
        var jsonSerializerSettings = new JsonSerializerSettings()
        {
            ContractResolver = new DefaultContractResolver()
            {
                NamingStrategy = new PascalCaseNamingStrategy(),
            },
        };

        return Json(entries, jsonSerializerSettings);
    }
}
