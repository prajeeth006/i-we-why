// Copyright (c) Microsoft Open Technologies, Inc. All rights reserved. See License.txt in the project root for license information.

using System;
using System.Diagnostics.CodeAnalysis;
using System.Linq.Expressions;
using System.Reflection;

#pragma warning disable 659 // overrides AddToHashCodeCombiner instead
namespace Frontend.Vanilla.Core.Expressions;

// UnaryExpression fingerprint class
// The most common appearance of a UnaryExpression is a cast or other conversion operator
[SuppressMessage("Microsoft.Usage", "CA2218:OverrideGetHashCodeOnOverridingEquals", Justification = "Overrides AddToHashCodeCombiner() instead.")]
[SuppressMessage("ReSharper", "SX1101", Justification = "Pasted code")]
[SuppressMessage("ReSharper", "SA1512", Justification = "Pasted code")]
internal sealed class UnaryExpressionFingerprint(ExpressionType nodeType, Type type, MethodInfo method) : ExpressionFingerprint(nodeType, type)
{
    // Other properties on UnaryExpression (like IsLifted / IsLiftedToNull) are simply derived
    // from Type and NodeType, so they're not necessary for inclusion in the fingerprint.

    // http://msdn.microsoft.com/en-us/library/system.linq.expressions.unaryexpression.method.aspx
    public MethodInfo Method { get; private set; } = method;

    public override bool Equals(object? obj)
    {
        var other = obj as UnaryExpressionFingerprint;

        return (other != null)
               && Equals(this.Method, other.Method)
               && this.Equals(other);
    }

    internal override void AddToHashCodeCombiner(HashCodeCombiner combiner)
    {
        combiner.AddObject(Method);
        base.AddToHashCodeCombiner(combiner);
    }
}
