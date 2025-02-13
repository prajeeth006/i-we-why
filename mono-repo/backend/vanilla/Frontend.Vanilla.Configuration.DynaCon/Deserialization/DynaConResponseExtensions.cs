using System.Linq;
using Bwin.DynaCon.Api.Contracts.V1;
using Newtonsoft.Json.Linq;

namespace Frontend.Vanilla.Configuration.DynaCon.Deserialization;

internal static class DynaConResponseExtensions
{
    public static JToken GetJsonValue(this KeyConfiguration keyDto)
    {
        var value = keyDto.Values.First().Value;

        return value != null ? JToken.FromObject(value) : JValue.CreateNull();
    }
}
