using System.Collections.Generic;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

namespace Frontend.Vanilla.ServiceClients.Services.Crm.ReferredFriends;

internal sealed class ReferredFriends(IReadOnlyList<Friend> friends = default) : IPosApiResponse<ReferredFriends>
{
    public IReadOnlyList<Friend> Friends { get; } = friends.NullToEmpty();

    public ReferredFriends GetData() => this;
}

internal sealed class Friend(
    EmailContact emailContact,
    string referredChannel,
    bool isDisqualified,
    IReadOnlyList<Reward> rewards,
    string status)
{
    public EmailContact EmailContact { get; } = emailContact;
    public string ReferredChannel { get; } = referredChannel;
    public bool IsDisqualified { get; } = isDisqualified;
    public IReadOnlyList<Reward> Rewards { get; } = rewards.NullToEmpty();
    public string Status { get; } = status;
}

internal sealed class EmailContact(string emailId, string firstName, string lastName)
{
    public string EmailId { get; } = emailId;
    public string FirstName { get; } = firstName;
    public string LastName { get; } = lastName;
}

internal sealed class Reward(
    string awardType,
    string awardValue,
    string currencyCode,
    string currencySymbol,
    int bonusAmount,
    int maxBonusAmount,
    bool bonusAutoOptIn,
    int bonusNoOfDaysToClaim)
{
    public string AwardType { get; } = awardType;
    public string AwardValue { get; } = awardValue;
    public string CurrencyCode { get; } = currencyCode;
    public string CurrencySymbol { get; } = currencySymbol;
    public int BonusAmount { get; } = bonusAmount;
    public int MaxBonusAmount { get; } = maxBonusAmount;
    public bool BonusAutoOptIn { get; } = bonusAutoOptIn;
    public int BonusNoOfDaysToClaim { get; } = bonusNoOfDaysToClaim;
}
