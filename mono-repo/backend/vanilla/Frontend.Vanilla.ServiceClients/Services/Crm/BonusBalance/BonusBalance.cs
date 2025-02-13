using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

namespace Frontend.Vanilla.ServiceClients.Services.Crm.BonusBalance;

internal sealed class ProductBonusInfo(IReadOnlyList<Bonus> bonuses)
{
    public IReadOnlyList<Bonus> Bonuses { get; } = bonuses;
}

internal sealed class Bonus(decimal bonusAmount, bool isBonusActive, IReadOnlyList<string> applicableProducts)
{
    public decimal BonusAmount { get; } = bonusAmount;
    public bool IsBonusActive { get; } = isBonusActive;
    public IReadOnlyList<string> ApplicableProducts { get; } = applicableProducts;
}

internal sealed class BonusBalanceResponse : IPosApiResponse<IReadOnlyDictionary<string, ProductBonusInfo>>
{
    public IEnumerable<KeyValuePair<string, ProductBonusInfo>> ProductWiseBonusInfo { get; set; }

    public IReadOnlyDictionary<string, ProductBonusInfo> GetData()
    {
        if (ProductWiseBonusInfo == null)
        {
            return new Dictionary<string, ProductBonusInfo>();
        }

        return ProductWiseBonusInfo
            .ToDictionary(
                kv => kv.Key,
                kv => new ProductBonusInfo(kv.Value.Bonuses.ConvertAll(ConvertBonus)));
    }

    private Bonus ConvertBonus(Bonus bonus)
    {
        return new Bonus(bonus.BonusAmount / 100, bonus.IsBonusActive, bonus.ApplicableProducts.Select(p => p.Trim()).ToList());
    }
}
