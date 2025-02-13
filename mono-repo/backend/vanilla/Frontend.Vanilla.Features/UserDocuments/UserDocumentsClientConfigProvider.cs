using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.Vanilla.Features.UserDocuments;

internal sealed class UserDocumentsClientConfigProvider(IUserDocumentsConfiguration config) : LambdaClientConfigProvider("vnUserDocuments", () => new
{
    config.DepositLimitNoticeThreshold,
})
{
    public override ClientConfigType Type => ClientConfigType.Lazy;
}
