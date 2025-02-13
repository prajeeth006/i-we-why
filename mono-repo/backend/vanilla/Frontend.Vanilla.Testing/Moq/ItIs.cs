using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using Moq;

namespace Frontend.Vanilla.Testing.Moq;

internal static class ItIs
{
    /// <summary>
    ///     Useful when you want to match object in a variable/field even if it gets assigned afterwards.
    ///     <code>
    /// var hero = new Hero("Batman");
    /// service.Setup(s => s.Foo(hero)).Returns("foo"); // Only current object in hero variable will match
    /// service.Setup(s => s.Bar(hero)).Returns("bar"); // Any object in hero variable will match
    /// hero = new Hero("Joker");
    /// </code>
    /// </summary>
    public static T SameAs<T>(Func<T> getObj)
        where T : class
    {
        return It.Is<T>(o => ReferenceEquals(o, getObj()));
    }

    /// <summary>
    ///     Useful when checking logged message.
    /// </summary>
    public static string NotWhiteSpace()
    {
        return It.Is<string>(s => !string.IsNullOrWhiteSpace(s));
    }

    public static Expression<Func<TSource, TResult>> Expression<TSource, TResult>(Expression<Func<TSource, TResult>> expectedExpr)
    {
        return It.Is<Expression<Func<TSource, TResult>>>(e => ToString(e) == ToString(expectedExpr));
    }

    private static string ToString<TDelegate>(Expression<TDelegate> expr)
    {
        var argName = expr.Parameters[0].Name;

        return expr.ToString()
            .Substring(argName.Length + " => ".Length)
            .Replace(argName + ".", "x.");
    }

    public static TCollection Equivalent<TCollection>(TCollection collection)
        where TCollection : IEnumerable
    {
        return It.Is<TCollection>(c => new HashSet<object>(c.Cast<object>()).SetEquals(collection.Cast<object>()));
    }

    public static TCollection SequenceEqual<TCollection>(TCollection collection)
        where TCollection : IEnumerable
    {
        return It.Is<TCollection>(c => c.Cast<object>().SequenceEqual(collection.Cast<object>()));
    }

    public static TCollection Empty<TCollection>()
        where TCollection : IEnumerable
    {
        return It.Is<TCollection>(c => !c.Cast<object>().Any());
    }
}
