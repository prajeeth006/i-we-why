using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

#pragma warning disable CS1591 // Just dummy data -> no docs needed
namespace Frontend.Vanilla.ServiceClients.Services.Account.MohDetails;

public class MohDetailsResponse(
    string comments = null,
    string countryCode = null,
    int exclDays = 0,
    int mohPrimaryReasonCode = 0,
    int mohPrimaryRiskBandCode = 0,
    int mohPrimaryProductCode = 0,
    int mohPrimaryToolCode = 0,
    int mohScore = 0,
    string processed = null,
    string vipUser = null)
    : IPosApiResponse<MohDetailsResponse>
{
    public string Comments { get; } = comments;
    public string CountryCode { get; } = countryCode;
    public int ExclDays { get; } = exclDays;
    public int MohPrimaryProductCode { get; } = mohPrimaryProductCode;
    public int MohPrimaryReasonCode { get; } = mohPrimaryReasonCode;
    public int MohPrimaryRiskBandCode { get; } = mohPrimaryRiskBandCode;
    public int MohPrimaryToolCode { get; } = mohPrimaryToolCode;
    public int MohScore { get; } = mohScore;
    public string Processed { get; } = processed;
    public string VipUser { get; } = vipUser;

    MohDetailsResponse IPosApiResponse<MohDetailsResponse>.GetData() => this;
}
