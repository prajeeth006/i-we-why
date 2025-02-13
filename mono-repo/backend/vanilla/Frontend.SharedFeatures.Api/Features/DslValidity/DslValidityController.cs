using System.ComponentModel.DataAnnotations;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.DomainSpecificLanguage.Parsing;
using Frontend.Vanilla.Features.API;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.SharedFeatures.Api.Features.DslValidity;

[AllowAnonymous]
[Route("api/dsl/validity")]
[ApiController]
public class DslValidityController(IDslSyntaxValidator dslSyntaxValidator) : BaseController
{
    /// <summary>
    /// Validate DSL expression.
    /// </summary>
    /// <remarks>Returns validation result with following info: isValid: true/false, errorMessage and warnings.</remarks>
    /// <param name="request">Indicates DSL expression request.</param>
    [HttpGet]
    public IActionResult Get([FromQuery] ValidationRequest request)
    {
        if (string.IsNullOrWhiteSpace(request?.Expression))
        {
            return BadRequest($"Parameter {nameof(request.Expression)} is missing.");
        }

        var resultType = FindClrType(request.ClrType);

        if (resultType == null)
        {
            return BadRequest($"Parameter {nameof(request.ClrType)} is invalid. Supported values are: {ExpressionTreeParser.SupportedResultTypes.Join()}");
        }

        var validationResult = dslSyntaxValidator.Validate(request.Expression, resultType);

        return OkResult(validationResult);
    }

    private static Type? FindClrType(string clrType)
    {
        try
        {
            return Type.GetType(clrType, true);
        }
        catch
        {
            return null;
        }
    }
}

public class ValidationRequest
{
    /// <summary>
    /// Indicates DSL expression to be validated i.e. User.LoggedIn.
    /// </summary>
    [Required]
    public string Expression { get; set; } = null!;

    /// <summary>
    /// Indicates underlying .NET result type. Supported result types are: <see cref="ExpressionTreeParser.SupportedResultTypes"/>.
    /// </summary>
    [Required]
    public string ClrType { get; set; } = null!;
}
