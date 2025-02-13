using Newtonsoft.Json;

namespace Frontend.Vanilla.ServiceClients.Services.Wallet.BankAccountInfo;

internal sealed class BankAccountInfoDto
{
    public string AccountType { get; set; }

    [JsonProperty("accountno")]
    public string AccountNumber { get; set; }

    [JsonProperty("bankaddress")]
    public string BankAddress { get; set; }

    [JsonProperty("bankcountry")]
    public string BankCountry { get; set; }

    [JsonProperty("bankid")]
    public int BankId { get; set; }

    [JsonProperty("bankidSpecified")]
    public bool BankIdSpecified { get; set; }

    [JsonProperty("bankname")]
    public string BankName { get; set; }

    [JsonProperty("firstname")]
    public string Firstname { get; set; }

    public string Iban { get; set; }

    [JsonProperty("lastname")]
    public string Lastname { get; set; }

    [JsonProperty("paycurrency")]
    public string PayCurrency { get; set; }

    [JsonProperty("routingnumber")]
    public string RoutingNumber { get; set; }

    [JsonProperty("swiftcode")]
    public string SwiftCode { get; set; }
}
