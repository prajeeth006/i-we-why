using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Crm;
using Frontend.Vanilla.ServiceClients.Services.Crm2;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Crm2
{
    public class PosApiCrmServiceTests
    {
        private readonly PosApiCrmService posApiCrmService;
        private readonly Mock<ICrmServiceClient> crmServiceClientMock;
        private readonly Mock<ICurrentUserAccessor> currentUserMock;
        private readonly TestLogger<PosApiCrmService> log;
        private readonly CancellationToken ct;

        public PosApiCrmServiceTests()
        {
            ct = TestCancellationToken.Get();
            crmServiceClientMock = new Mock<ICrmServiceClient>();
            currentUserMock = new Mock<ICurrentUserAccessor>();
            log = new TestLogger<PosApiCrmService>();

            posApiCrmService = new PosApiCrmService(crmServiceClientMock.Object, currentUserMock.Object, log);
        }

        [Fact]
        public async Task GetMLifeProfileAsync_ShouldLogInformation()
        {
            var ex = new PosApiException(
                        "Exception",
                        httpCode: HttpStatusCode.NotFound,
                        posApiCode: 103,
                        posApiMessage: "MLife does not exists for given account",
                        posApiValues: new Dictionary<string, string>
                        {
                            { "ErrorCode", "103" },
                            { "ErrorMessage", "MLife does not exists for given account" },
                        });

            currentUserMock.Setup(c => c.User.Identity.IsAuthenticated).Returns(true);
            crmServiceClientMock.Setup(s => s.GetMLifeProfileAsync(It.IsAny<CancellationToken>())).ThrowsAsync(ex);

            var result = await posApiCrmService.GetMLifeProfileAsync(ct); // Act

            log.Logged.Single().Verify(LogLevel.Information, ex);
        }
    }
}
