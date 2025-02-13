using System;
using System.Globalization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Serialization;

namespace Frontend.Vanilla.Features.Globalization.Configuration;

/// <summary>
/// The CultureInfo (de)serializer that populates deserialized culture override (JSON object) onto
/// provided CultureInfo instance.
/// </summary>
internal interface ICultureSerializer
{
    /// <summary>
    /// Deserialize the culture override and populate its properties onto provided culture object.
    /// </summary>
    /// <param name="culture">The CultureInfo instance which the override will be applied to.</param>
    /// <param name="cultureOverride">JSON object containing culture override.</param>
    void DeserializeAndPopulateOverride(CultureInfo culture, JObject cultureOverride);
}

internal class CultureSerializer : ICultureSerializer
{
    public void DeserializeAndPopulateOverride(CultureInfo culture, JObject cultureOverride)
        => cultureOverride.ToObject<CultureInfo>(new JsonSerializer
        {
            NullValueHandling = NullValueHandling.Ignore,
            ContractResolver = new CultureInfoContractResolver(culture),
        });
}

internal class CultureInfoContractResolver(CultureInfo baseCulture) : DefaultContractResolver
{
    protected override JsonConverter ResolveContractConverter(Type objectType)
        => objectType == typeof(CultureInfo)
            ? new CultureInfoMergingConverter(baseCulture)
            : base.ResolveContractConverter(objectType)!;

    public override JsonContract ResolveContract(Type type)
        => type == typeof(CultureInfo)
            ? CreateObjectContract(type)
            : base.ResolveContract(type);
}

/// <summary>
/// This class deserializes the JSON and then populates its properties onto the existing CultureInfo
/// object instance provided in the constructor. The trick is to not let the Newtonsoft library
/// to instantiate the CultureInfo by itself but rather inheriting from the CustomCreationConverter
/// class that lets us provide our own (already existing) instance instead.
/// </summary>
internal class CultureInfoMergingConverter(CultureInfo baseCulture) : CustomCreationConverter<CultureInfo>
{
    public override CultureInfo Create(Type objectType) => baseCulture;
}
