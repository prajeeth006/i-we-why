using System.ComponentModel.DataAnnotations;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.AntiForgeryProtection;
using Frontend.Vanilla.Features.API;
using Frontend.Vanilla.Features.ReCaptcha;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.TestWeb.Api;

[Route("{culture}/playground/api/[controller]")]
public class ReCaptchaController(IServiceProvider serviceProvider) : BaseController
{
    private const string TestArea = "Test";
    private readonly IReCaptchaService service = serviceProvider.GetRequiredService<IReCaptchaService>();
    private readonly IFailureCounter counter = serviceProvider.GetRequiredService<IFailureCounter>();

    [HttpPost]
    public async Task<IActionResult> Post(ReCaptchaModel model, CancellationToken ct)
    {
        if (await service.IsEnabledAsync(TestArea, ct))
        {
            if (!await service.VerifyUsersResponseAsync(TestArea, model.CaptchaResponse, new Dictionary<string, object>(), ct))
            {
                var msg = await service.GetVerificationMessageAsync(ct);
                ModelState.AddModelError(nameof(model.CaptchaResponse), msg);
            }
        }

        if (!ModelState.IsValid)
        {
            await service.ReportFailureAsync(TestArea, ct);
            var invalidFields = ModelState.Where(f => f.Value.Errors.Count > 0).Select(f => f.Key.RemovePrefix(nameof(model) + "."));

            return BadRequest(EnumerableExtensions.Join(invalidFields, ","));
        }

        await service.ReportSuccessAsync(TestArea, ct);

        return Ok(new { Message = $"Congratulations {model.FirstName} {model.LastName}!" });
    }

    [BypassAntiForgeryToken]
    [HttpGet("clearcounter")]
    public async Task<IActionResult> ClearCounter(CancellationToken ct)
    {
        await counter.ClearAsync(TestArea, ct);

        return Ok();
    }
}

public class ReCaptchaModel
{
    [Required]
    public string FirstName { get; set; }

    [Required]
    public string LastName { get; set; }

    public string CaptchaResponse { get; set; }
}
