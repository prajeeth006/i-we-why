using System;
using System.Runtime.ExceptionServices;
using Frontend.Vanilla.Core.Patterns;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Microsoft.Extensions.Caching.Memory;

namespace Frontend.Vanilla.DomainSpecificLanguage.Compilation;

/// <summary>
/// Caches DSL expressions because they are immutable and executed very often especially by Content API.
/// </summary>
internal sealed class CachedDslCompiler(IDslCompiler inner, IMemoryCache memoryCache) : DslCompilerBase
{
    public override WithWarnings<IDslExpression<T>> Compile<T>(RequiredString expression)
    {
        var cacheKey = new DslCacheKey(typeof(T), expression);
        var item = memoryCache.GetOrCreate(cacheKey, CompileFresh<T>);

        return item!.Result;
    }

    private DslCachedItem<T> CompileFresh<T>(ICacheEntry entry)
        where T : notnull
    {
        var expression = ((DslCacheKey)entry.Key).Expression;
        entry.SetSlidingExpiration(TimeSpan.FromHours(1));

        try
        {
            var result = inner.Compile<T>(expression);

            return new DslCachedResult<T>(result);
        }
        catch (Exception ex)
        {
            return new DslCachedError<T>(ExceptionDispatchInfo.Capture(ex));
        }
    }

    private sealed class DslCacheKey(Type resultType, RequiredString expression) : Tuple<string, Type, string>("Van:DSL", resultType, expression.Value.Trim())
    {
        // Trim to cache single result regardless white-spaces
        public string Expression => Item3;
    }

    private abstract class DslCachedItem<T>
        where T : notnull
    {
        public abstract WithWarnings<IDslExpression<T>> Result { get; }
    }

    private sealed class DslCachedResult<T>(WithWarnings<IDslExpression<T>> result) : DslCachedItem<T>
        where T : notnull
    {
        public override WithWarnings<IDslExpression<T>> Result { get; } = result;
    }

    private sealed class DslCachedError<T>(ExceptionDispatchInfo error) : DslCachedItem<T>
        where T : notnull
    {
        public override WithWarnings<IDslExpression<T>> Result => throw error.ThrowException();
    }
}
