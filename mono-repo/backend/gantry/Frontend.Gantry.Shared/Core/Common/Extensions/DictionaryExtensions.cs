using System.Collections.Generic;

namespace Frontend.Gantry.Shared.Core.Common.Extensions
{
    public static class DictionaryExtensions
    {
        public static bool TryAdd<TKey, TValue>(this Dictionary<TKey, TValue> dictionary, TKey key, TValue value)
        {
            if (dictionary.ContainsKey(key))
            {
                return false;
            }

            dictionary.Add(key, value);

            return true;
        }

        public static TValue GetValueOrDefault<TKey, TValue>(this Dictionary<TKey, TValue> dictionary, TKey key, TValue defaultValue)
        {
            if (dictionary.TryGetValue(key, out TValue foundValue))
            {
                return foundValue;
            }
            
            return defaultValue;
        }

        public static void AddOrUpdate<TKey, TValue>(this Dictionary<TKey, TValue> dictionary, TKey key, TValue value)
        {
            if (dictionary.ContainsKey(key))
            {
                dictionary.Remove(key);
            }

            dictionary.Add(key, value);
        }
    }
}