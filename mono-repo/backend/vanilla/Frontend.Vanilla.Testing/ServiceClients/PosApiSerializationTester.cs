using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Infrastructure.Execution;

namespace Frontend.Vanilla.Testing.ServiceClients;

/// <summary>
///     Test helper to verify serialization of data objects using <see cref="IPosApiRestClient" />.
/// </summary>
public static class PosApiSerializationTester
{
    /// <summary>
    ///     Deserializes specified type from given JSON in the same ways as <see cref="IPosApiRestClient" /> does.
    /// </summary>
    public static T Deserialize<T>(string json)
    {
        return (T)PosApiRestClient.Formatter.Deserialize(json.EncodeToBytes(), typeof(T));
    }

    /// <summary>
    ///     Deserializes given object to JSON string in the same ways as <see cref="IPosApiRestClient" /> does.
    /// </summary>
    public static string Serialize(object obj)
    {
        return PosApiRestClient.Formatter.Serialize(obj).DecodeToString();
    }
}
