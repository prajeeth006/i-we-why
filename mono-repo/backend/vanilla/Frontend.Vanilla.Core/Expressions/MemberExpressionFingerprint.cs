// Copyright (c) Microsoft Open Technologies, Inc. All rights reserved. See License.txt in the project root for license information.

using System;
using System.Diagnostics.CodeAnalysis;
using System.Linq.Expressions;
using System.Reflection;

#pragma warning disable 659 // overrides AddToHashCodeCombiner instead
namespace Frontend.Vanilla.Core.Expressions;

// MemberExpression fingerprint class
// Expression of form xxx.FieldOrProperty
[SuppressMessage("Microsoft.Usage", "CA2218:OverrideGetHashCodeOnOverridingEquals", Justification = "Overrides AddToHashCodeCombiner() instead.")]
[SuppressMessage("ReSharper", "SX1101", Justification = "Pasted code")]
[SuppressMessage("ReSharper", "SA1512", Justification = "Pasted code")]
internal sealed class MemberExpressionFingerprint(ExpressionType nodeType, Type type, MemberInfo member) : ExpressionFingerprint(nodeType, type)
{
    // http://msdn.microsoft.com/en-us/library/system.linq.expressions.memberexpression.member.aspx
    public MemberInfo Member { get; private set; } = member;

    public override bool Equals(object? obj)
    {
        var other = obj as MemberExpressionFingerprint;

        return (other != null)
               && Equals(this.Member, other.Member)
               && this.Equals(other);
    }

    internal override void AddToHashCodeCombiner(HashCodeCombiner combiner)
    {
        combiner.AddObject(Member);
        base.AddToHashCodeCombiner(combiner);
    }
}
