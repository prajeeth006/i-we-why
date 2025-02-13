#nullable enable

using System;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Time;
using Frontend.Vanilla.ServiceClients.Security;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Linq;

namespace Frontend.Vanilla.ServiceClients.Infrastructure.Caching;

/// <summary>
/// Stores <see cref="PosApiDataType.User" /> data all in a single <see cref="UserDataContainer" /> using <see cref="IUserDataContainerManager" />.
/// </summary>
internal interface IUserDataCache
{
    Task<object?> GetAsync(ExecutionMode mode, PosApiAuthTokens authTokens, RequiredString key, Type resultType);
    Task SetAsync(ExecutionMode mode, PosApiAuthTokens authTokens, RequiredString key, object value, TimeSpan relativeExpiration);
    Task RemoveAsync(ExecutionMode mode, PosApiAuthTokens authTokens, RequiredString key);
}

internal sealed class UserDataCache(IUserDataContainerManager userDataContainerManager, IClock clock) : IUserDataCache
{
    private static readonly JsonSerializer JsonSerializer = JsonSerializer.Create(new JsonSerializerSettings { Converters = { new StringEnumConverter() } });

    // Very likely that this gets called first -> async to be faster
    public async Task<object?> GetAsync(ExecutionMode mode, PosApiAuthTokens authTokens, RequiredString key, Type resultType)
    {
        var container = await userDataContainerManager.GetContainerAsync(mode, authTokens);
        var item = container.Items.GetValue(key);

        if (item == null || item.Expires < clock.UtcNow) // Item will be cleaned when writing to distributed cache
            return null;

        if (item.DeserializedValue == null) // We know the type for the first time -> deserialize
            try
            {
                item.DeserializedValue = item.Json.ToObject(resultType, JsonSerializer) ?? throw new Exception("Null deserialized.");
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed deserializing {resultType} from JSON: {item.Json}.", ex);
            }

        return item.DeserializedValue;
    }

    public async Task SetAsync(ExecutionMode mode, PosApiAuthTokens authTokens, RequiredString key, object value, TimeSpan relativeExpiration)
    {
        JToken json;

        try
        {
            json = JToken.FromObject(value, JsonSerializer);
        }
        catch (Exception ex)
        {
            throw new Exception($"Failed serializing {value.GetType()} to JSON.", ex);
        }

        var container = await userDataContainerManager.GetContainerAsync(mode, authTokens);
        container.Items[key] = new UserDataItem(json, clock.UtcNow + relativeExpiration) { DeserializedValue = value };
        container.IsModified = true;
    }

    public async Task RemoveAsync(ExecutionMode mode, PosApiAuthTokens authTokens, RequiredString key)
    {
        var container = await userDataContainerManager.GetContainerAsync(mode, authTokens);

        if (container.Items.Remove(key))
            container.IsModified = true;
    }
}
