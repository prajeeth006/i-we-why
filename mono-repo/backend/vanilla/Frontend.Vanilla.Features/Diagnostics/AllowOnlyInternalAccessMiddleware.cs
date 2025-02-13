using System.Linq;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Net;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.Features.App;
using Frontend.Vanilla.Features.WebAbstractions;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.Diagnostics
{
    internal sealed class AllowOnlyInternalAccessMiddleware : WebAbstractions.Middleware
    {
        private readonly IInternalRequestEvaluator internalRequestEvaluator;
        private readonly IAppConfiguration appConfiguration;
        public const string PublicInternetMessage = "Forbidden because you are coming from public Internet!";

        public AllowOnlyInternalAccessMiddleware(RequestDelegate next, IInternalRequestEvaluator internalRequestEvaluator, IAppConfiguration appConfiguration)
            : base(next)
        {
            this.internalRequestEvaluator = internalRequestEvaluator;
            this.appConfiguration = appConfiguration;
        }

        public override Task InvokeAsync(HttpContext context)
        {
            if (internalRequestEvaluator.IsInternal())
                return Next(context);

            var isPathRestricted = appConfiguration.AllowOnlyInternallyPaths.Any(r => context.Request.Path.StartsWithSegments(r, System.StringComparison.OrdinalIgnoreCase));

            if (!isPathRestricted)
                return Next(context);

            context.Response.StatusCode = StatusCodes.Status403Forbidden;
            return context.WriteResponseAsync(ContentTypes.Text, PublicInternetMessage);
        }
    }
}
