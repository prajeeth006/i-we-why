using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.TestWeb.Features.ClientConfigProviders;

public class TestConfigProvider1() : LambdaClientConfigProvider("playgroundConfig1", () => new { key1 = "value1", time = DateTime.Now }) { }

public class TestConfigProvider2() : LambdaClientConfigProvider("playgroundConfig2", () => new { key1 = "value1a", key2 = "value2" }) { }
