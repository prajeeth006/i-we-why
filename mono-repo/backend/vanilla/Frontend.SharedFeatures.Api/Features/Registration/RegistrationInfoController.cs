using Frontend.Vanilla.Core.Time;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.ServiceClients.Claims;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Account;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.SharedFeatures.Api.Features.Registration;

[ApiController]
[Route("{culture}/api/[controller]")]
public class RegistrationInfoController : Controller
{
    private readonly IPosApiAccountServiceInternal posApiAccountService;
    private readonly IClock clock;
    private readonly ICurrentUserAccessor currentUserAccessor;
    private readonly ILogger logger;

    public RegistrationInfoController(IServiceProvider provider, IClock clock, ICurrentUserAccessor currentUserAccessor, ILogger<RegistrationInfoController> log)
        : this(provider.GetRequiredService<IPosApiAccountServiceInternal>(), clock, currentUserAccessor, log) { }

    internal RegistrationInfoController(IPosApiAccountServiceInternal posApiAccountService, IClock clock, ICurrentUserAccessor currentUserAccessor, ILogger<RegistrationInfoController> logger)
    {
        this.posApiAccountService = posApiAccountService;
        this.clock = clock;
        this.currentUserAccessor = currentUserAccessor;
        this.logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> Get(CancellationToken cancellationToken)
    {
        var user = currentUserAccessor.User;
        try
        {
            var registrationDate = await posApiAccountService.GetRegistrationDateAsync(cancellationToken);

            return Ok(new
            {
                date = registrationDate.ToUserLocalTime(user).ToString(RegistrationDslProviderConstants.RegistrationDateFormat),
                daysRegistered = (clock.UtcNow.ToUserLocalTime(user).Date - registrationDate.Value.Date).Days,
            });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Service exception while getting RegistrationInfo details");

            return BadRequest();
        }
    }
}
