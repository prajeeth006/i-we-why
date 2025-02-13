using System.ComponentModel.DataAnnotations;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.API;
using Frontend.Vanilla.Features.Json.ActionResults;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.SharedFeatures.Api.Features.Crypto;

[AllowAnonymous]
[Route("{culture}/api/[controller]")]
[ApiController]
public class CryptoController(IDataProtectionProvider dataProtectionProvider, ILogger<CryptoController> log) : BaseController
{
    [HttpGet("encrypt")]
    public IActionResult Encrypt([Required] string data, [Required] string purpose)
    {
        try
        {
            var dataProtector = dataProtectionProvider.CreateProtector(purpose);

            var result = dataProtector.Protect(data.EncodeToBytes());

            return Ok(new { result });
        }
        catch (Exception e)
        {
            log.LogError(e, "Encryption for purpose {Scope} failed with {Exception}", purpose, e);

            return BadRequest().WithTechnicalErrorMessage(scope: "encrypt");
        }
    }

    [HttpGet("decrypt")]
    public IActionResult Decrypt([Required] [FromQuery] byte[] data, [Required] string purpose)
    {
        try
        {
            var dataProtector = dataProtectionProvider.CreateProtector(purpose);

            var result = dataProtector.Unprotect(data).DecodeToString();

            return Ok(new { result });
        }
        catch (Exception e)
        {
            log.LogError(e, "Decryption for purpose {Scope} failed with {Exception}", purpose, e);

            return BadRequest().WithTechnicalErrorMessage(scope: "decrypt");
        }
    }
}
