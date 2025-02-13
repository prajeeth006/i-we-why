using System.Collections.Generic;
using System.Threading.Tasks;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Wallet.CustomerNetDeposit;
using Frontend.Vanilla.ServiceClients.Tests.TestUtilities;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Wallet.CustomerNetDeposit;

public class CustomerNetDepositServiceClientTests : ServiceClientTestsBase
{
    private ICustomerNetDepositServiceClient target;

    protected override void Setup()
    {
        target = new CustomerNetDepositServiceClient(RestClient.Object, Cache.Object);
    }

    [Fact]
    public async Task ShouldCallUrlCorrectly()
    {
        RestClientResult = new CustomerNetDepositDto(new List<CustomerNetDepositAmount>
        {
            new ()
            {
                Amount = 54.4M,
            },
            new ()
            {
                Amount = 133,
            },
            new ()
            {
                Amount = -103,
            },
        });

        await target.GetAsync(TestMode.AsyncCancellationToken.Value, "MONTHLY", true);

        VerifyCache_GetOrCreateAsync<CustomerNetDepositDto>(PosApiDataType.User, "CustomerNetDepositMONTHLY", true);
        VerifyRestClient_ExecuteAsync("Wallet.svc/CustomerNetDeposit?timeSlot=MONTHLY", authenticate: true, resultType: typeof(CustomerNetDepositDto));
    }
}
