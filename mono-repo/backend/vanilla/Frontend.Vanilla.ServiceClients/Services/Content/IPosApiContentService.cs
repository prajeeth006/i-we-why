using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Services.Content.BettingTranslations;

namespace Frontend.Vanilla.ServiceClients.Services.Content;

internal interface IPosApiContentService
{
    Task<Translation> GetTranslationAsync(ExecutionMode mode, string type, string id);
}

internal sealed class PosApiContentService(IBettingTranslationsServiceClient bettingTranslationsServiceClient)
    : IPosApiContentService
{
    public Task<Translation> GetTranslationAsync(ExecutionMode mode, string type, string id)
        => bettingTranslationsServiceClient.GetTranslationAsync(mode, type, id);
}
