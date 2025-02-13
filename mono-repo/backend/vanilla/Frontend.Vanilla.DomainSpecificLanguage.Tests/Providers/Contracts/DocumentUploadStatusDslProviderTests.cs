using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Moq;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Providers.Contracts;

public class DocumentUploadStatusDslProviderTests : SyntaxTestBase<IDocumentUploadStatusDslProvider>
{
    [Fact]
    public void DocumentUploadStatusIsPending_Test()
    {
        Provider.Setup(p => p.IsPendingAsync(Mode, "KYC")).ReturnsAsync(true);
        EvaluateAndExpect("DocumentUploadStatus.IsPending(\"KYC\")", true);
    }

    [Fact]
    public void DocumentUploadStatusIsPendingWith_Test()
    {
        Provider.Setup(p => p.PendingWithAsync(Mode, "KYC")).ReturnsAsync("ABC");
        EvaluateAndExpect("DocumentUploadStatus.PendingWith(\"KYC\")", "ABC");
    }
}
