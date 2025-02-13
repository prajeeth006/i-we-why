using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.Vanilla.Features.UserBalance;

internal class BalanceSettingsConfigProvider(IBalanceConfiguration balanceConfiguration) : LambdaClientConfigProvider("vnBalanceSettings", () => balanceConfiguration) { }
