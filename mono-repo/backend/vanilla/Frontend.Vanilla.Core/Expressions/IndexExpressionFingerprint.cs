// Copyright (c) Microsoft Open Technologies, Inc. All rights reserved. See License.txt in the project root for license information.

using System;
using System.Diagnostics.CodeAnalysis;
using System.Linq.Expressions;
using System.Reflection;

#pragma warning disable 659 // overrides AddToHashCodeCombiner instead
namespace Frontend.Vanilla.Core.Expressions;

// IndexExpression fingerprint class
// Represents certain forms of array access or indexer property access
[SuppressMessage("Microsoft.Usage", "CA2218:OverrideGetHashCodeOnOverridingEquals", Justification = "Overrides AddToHashCodeCombiner() instead.")]
[SuppressMessage("ReSharper", "SX1101", Justification = "Pasted code")]
[SuppressMessage("ReSharper", "SA1512", Justification = "Pasted code")]
internal sealed class IndexExpressionFingerprint(ExpressionType nodeType, Type type, PropertyInfo indexer) : ExpressionFingerprint(nodeType, type)
{
    // Other properties on IndexExpression (like the argument count) are simply derived
    // from Type and Indexer, so they're not necessary for inclusion in the fingerprint.

    // http://msdn.microsoft.com/en-us/library/system.linq.expressions.indexexpression.indexer.aspx
    public PropertyInfo Indexer { get; private set; } = indexer;

    public override bool Equals(object? obj)
    {
        var other = obj as IndexExpressionFingerprint;

        return (other != null)
               && Equals(this.Indexer, other.Indexer)
               && this.Equals(other);
    }

    internal override void AddToHashCodeCombiner(HashCodeCombiner combiner)
    {
        combiner.AddObject(Indexer);
        base.AddToHashCodeCombiner(combiner);
    }
}
