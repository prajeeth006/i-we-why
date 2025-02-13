using System.Runtime.Serialization;
using System.Xml.Serialization;

namespace Frontend.Vanilla.ServiceClients.Services.Crm2;

[DataContract(Name = "Bonuses", Namespace = "")]
[XmlRoot(ElementName = "Bonuses", Namespace = "")]
internal class BonusOffersResponseDto
{
    [DataMember(Name = "BonusOffers")]
    [XmlArray(ElementName = "BonusOffers")]
    [XmlArrayItem(ElementName = "BonusOffer")]
    public BonusOfferDto[] BonusOffers { get; set; }
}
