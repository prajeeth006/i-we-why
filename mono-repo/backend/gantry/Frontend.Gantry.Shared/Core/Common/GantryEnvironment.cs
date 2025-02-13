namespace Frontend.Gantry.Shared.Core.Common
{
    public static class GantryEnvironment
    {
        public static string GetUrlBasedOnEnv(string env)
        {
            string result = env switch
            {
                "dev" => $"{env}.",
                "qa1" => $"{env}.",
                "qa2" => $"{env}.",
                "qa3" => $"{env}.",
                "qa4" => $"{env}.",
                "fvt" => $"{env}.",
                "test" => $"{env}.",
                "beta" => $"{env}-",
                "llt" => "load-",
                "prod" => "",
                _ => ""
            };

            return result;
        }
    }
}