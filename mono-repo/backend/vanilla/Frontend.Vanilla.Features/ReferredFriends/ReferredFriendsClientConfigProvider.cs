using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Client;
using Frontend.Vanilla.Content.Menus;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.ServiceClients.Services.Crm;
using Frontend.Vanilla.ServiceClients.Services.Crm.InvitationUrl;
using Microsoft.Extensions.Logging;
using Crm = Frontend.Vanilla.ServiceClients.Services.Crm.ReferredFriends;

namespace Frontend.Vanilla.Features.ReferredFriends;

internal sealed class ReferredFriendsClientConfigProvider(
    IVanillaClientContentService clientContentService,
    IMenuFactory menuFactory,
    IPosApiCrmServiceInternal posApiCrmServiceInternal,
    ILogger<ReferredFriendsClientConfigProvider> log)
    : LambdaClientConfigProvider("vnReferredFriends",
        async cancellationToken =>
        {
            const string path = $"{AppPlugin.ContentRoot}/ReferredFriends";

            var contentTask = clientContentService.GetChildrenAsync($"{path}/Content", cancellationToken);
            var detailsButtonTask = menuFactory.GetItemAsync($"{path}/DetailsButton", DslEvaluation.PartialForClient, cancellationToken);
            var trackReferralsButtonTask = menuFactory.GetItemAsync($"{path}/TrackReferralsButton", DslEvaluation.PartialForClient, cancellationToken);
            var shareContentTask = menuFactory.GetItemAsync($"{path}/ShareContent", DslEvaluation.PartialForClient, cancellationToken);

            var referredFriendsTask = posApiCrmServiceInternal
                .TryAsync(s => s.GetReferredFriendsAsync(ExecutionMode.Async(cancellationToken)), log, new Crm.ReferredFriends());
            var invitationUrlTask = posApiCrmServiceInternal
                .TryAsync(s => s.GetInvitationUrlAsync(ExecutionMode.Async(cancellationToken)), log, new InvitationUrl());

            return new
            {
                content = (await contentTask).ToDictionary(item => item.InternalId?.ItemName ?? string.Empty),
                detailsButton = await detailsButtonTask,
                trackReferralsButton = await trackReferralsButtonTask,
                shareContent = await shareContentTask,
                referredFriends = await referredFriendsTask ?? new Crm.ReferredFriends(),
                invitationUrl = await invitationUrlTask,
            };
        })
{
    public override ClientConfigType Type => ClientConfigType.Lazy;
}
